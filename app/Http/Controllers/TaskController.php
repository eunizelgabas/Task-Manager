<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\Task;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TaskController extends Controller
{
     public function index(Request $request)
    {
        $user = auth()->user();

        $query = Task::with(['project', 'user']);
        if (!$user->can('view all tasks')) {
            $query->where('user_id', $user->id);
        }
        // Apply filters
        if ($request->has('project_id')) {
            $query->where('project_id', $request->project_id);
        }
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }
         $tasks = $query->paginate(10);
        $projects = $user->can('view all projects')
            ? Project::all()
            : Project::where('user_id', $user->id)->get();
        return Inertia::render('Tasks/Index', [
            'tasks' => $tasks,
            'projects' => $projects,
            'filters' => $request->only(['project_id', 'status']),
            'can' => [
                'create' => $user->can('create tasks'),
                'edit' => $user->can('edit tasks'),
                'delete' => $user->can('delete tasks'),
                'assign' => $user->can('assign tasks'),
            ]
        ]);
    }

    public function create()
    {
        $this->authorize('create tasks');
        $projects = auth()->user()->can('view all projects')
            ? Project::all()
            : Project::where('user_id', auth()->id())->get();
        $users = User::role('member')->get();
        return Inertia::render('Tasks/Create', [
            'projects' => $projects,
            'users' => $users,
        ]);
    }
}
