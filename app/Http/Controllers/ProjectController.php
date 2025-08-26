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
   public function index()
    {
        $projects = Project::with('manager')
                          ->latest()
                          ->get();

        $users = User::select(['id', 'name'])->get();

        $stats = [
            'total' => Project::count(),
            'this_month' => Project::whereMonth('created_at', now()->month)->count(),
            'managers' => Project::distinct('manager_id')->count(),
        ];
        return Inertia::render('Projects', [
            'projects' => $projects,
            'users' => $users,
            'stats' => $stats
        ]);
    }


    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'       => 'required|string|max:255',
            'description' => 'nullable|string',
             'manager_id' => 'required|exists:users,id',
        ]);

        Project::create([
            ...$validated,
            'status' => 'To Do',
        ]);

        return redirect()->route('projects')->with('success', 'Task created.');
    }

    public function update(Request $request, Project $project)
    {
         $validated = $request->validate([
                'name' => 'required|string|max:255',
                'description' => 'nullable|string|max:1000',
                'manager_id' => 'required|exists:users,id',
            ]);
            $oldname = $project->name;
            $project->update($validated);
            return redirect()->back()->with('success', "Project '{$oldname}' has been updated successfully!");
    }

    public function destroy(Project $project)
    {
         $projectname = $project->name;
            $project->delete();
            return redirect()->back()->with('success', "Project '{$projectname}' has been deleted successfully!");
    }
}
