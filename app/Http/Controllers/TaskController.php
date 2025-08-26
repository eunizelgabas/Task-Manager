<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\Task;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TaskController extends Controller
{
    public function index()
    {
        $tasks = Task::with(['project', 'assignee'])
            ->latest()
            ->get();

        $projects = Project::select(['id', 'name'])->get();

        // Get all users (not just members)
        $users = User::select(['id', 'name'])->get();

        $stats = [
            'total' => Task::count(),
            'pending' => Task::where('status', 'pending')->count(),
            'in_progress' => Task::where('status', 'in_progress')->count(),
            'completed' => Task::where('status', 'completed')->count(),
        ];
        return Inertia::render('Tasks', [
            'tasks' => $tasks,
            'projects' => $projects,
            'users' => $users, // Changed from 'members' to 'users'
            'stats' => $stats
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string|max:1000',
            'status' => 'required|in:To Do,In Progress, Done',
            'project_id' => 'required|exists:projects,id',
            'assigned_to' => 'nullable|exists:users,id',
        ]);
        $task = Task::create($validated);
        return redirect()->back()->with('success', "Task '{$task->title}' has been created successfully!");
    }

    public function update(Request $request, Task $task)
    {

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string|max:1000',
            'status' => 'required|in:To Do,In Progress, Done',
            'project_id' => 'required|exists:projects,id',
            'assigned_to' => 'nullable|exists:users,id',
        ]);
        $oldTitle = $task->title;
        $task->update($validated);
        return redirect()->back()->with('success', "Task '{$oldTitle}' has been updated successfully!");
    }

    public function destroy(Task $task)
    {

        $taskTitle = $task->title;
        $task->delete();
        return redirect()->back()->with('success', "Task '{$taskTitle}' has been deleted successfully!");
    }
}
