<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\Task;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ProjectController extends Controller
{
   public function index(Request $request)
    {
        $user = Auth::user();
        $query = Task::with(['project', 'assignedUser']);

        // Filter by role
        if ($user->hasRole('Member')) {
            $query->where('assigned_to', $user->id);
        }

        // Filtering by project and status (optional via query string)
        if ($request->has('project_id')) {
            $query->where('project_id', $request->project_id);
        }

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        $tasks = $query->get();
        $projects = Project::all();

        return Inertia::render('Tasks/Index', [
            'tasks'    => $tasks,
            'projects' => $projects,
        ]);
    }

    public function create()
    {
        return Inertia::render('Tasks/Create', [
            'projects' => Project::all(),
            'members'  => User::role('Member')->get(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title'       => 'required|string|max:255',
            'description' => 'nullable|string',
            'project_id'  => 'required|exists:projects,id',
            'assigned_to' => 'required|exists:users,id',
        ]);

        Task::create([
            ...$validated,
            'status' => 'To Do',
        ]);

        return redirect()->route('tasks.index')->with('success', 'Task created.');
    }

    public function edit(Task $task)
    {
        return Inertia::render('Tasks/Edit', [
            'task'     => $task,
            'projects' => Project::all(),
            'members'  => User::role('Member')->get(),
        ]);
    }

    public function update(Request $request, Task $task)
    {
        $user = Auth::user();

        if ($user->hasRole('Member')) {
            $validated = $request->validate([
                'status' => 'required|in:To Do,In Progress,Done',
            ]);
            $task->update(['status' => $validated['status']]);
        } else {
            $validated = $request->validate([
                'title'       => 'sometimes|string|max:255',
                'description' => 'nullable|string',
                'status'      => 'required|in:To Do,In Progress,Done',
                'project_id'  => 'required|exists:projects,id',
                'assigned_to' => 'required|exists:users,id',
            ]);
            $task->update($validated);
        }

        return redirect()->route('tasks.index')->with('success', 'Task updated.');
    }

    public function destroy(Task $task)
    {
        $task->delete();

        return redirect()->route('tasks.index')->with('success', 'Task deleted.');
    }
}
