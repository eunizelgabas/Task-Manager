<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;

class UserController extends Controller
{

    public function index()
    {
       $users = User::with('roles')
                    ->select(['id', 'name', 'email', 'created_at'])
                    ->latest()
                    ->get();

        $roles = Role::all(['id', 'name']);

        $stats = [
            'total' => User::count(),
            'admins' => User::role('Admin')->count(),
        ];

        return Inertia::render('Users', [
            'users' => $users,
            'roles' => $roles,
            'stats' => $stats
        ]);
    }

    public function create()
    {
        return Inertia::render('Users', [
            'roles' => Role::pluck('name'),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'     => 'required|string|max:255',
            'email'    => 'required|email|unique:users',
            'password' => 'required|string|min:8|confirmed',
            'roles' => 'required|array',
            'roles.*' => 'exists:roles,name',
        ]);

        $user = User::create([
            'name'     => $validated['name'],
            'email'    => $validated['email'],
            'password' => Hash::make('password123'), // Default password
        ]);

        $user->assignRole($validated['roles']);

        return redirect()->route('users')->with('success', 'User created.');
    }

    public function edit(User $user)
    {
        return Inertia::render('Users', [
            'user'  => $user->load('roles'),
            'roles' => Role::pluck('name'),
        ]);
    }

    public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            'name'     => 'required|string|max:255',
            'email'    => 'required|email|unique:users,email,' . $user->id,
            'roles' => 'required|array|min:1', // Changed from 'role' to 'roles' and expect array
            'roles.*' => 'exists:roles,name',   // Validate each role in the array
        ]);

        $user->update([
            'name'     => $validated['name'],
            'email'    => $validated['email'],
        ]);

        // Only validate password if it's provided
            if ($request->filled('password')) {
                $validated['password'] = 'required|string|min:8|confirmed';
            }

            // Only update password if provided
            if ($request->filled('password')) {
                $validated['password'] = Hash::make($validated['password']);
            }
        $user->syncRoles([$validated['roles']]);

        return redirect()->route('users')->with('success', 'User updated.');
    }

    public function destroy(User $user)
    {
        try {
            // Prevent deleting the current user
            if ($user->id === auth()->id()) {
                return redirect()->back()->with('error', 'You cannot delete your own account!');
            }
            // Check if user has critical roles (optional protection)
            if ($user->hasRole('admin') && User::role('admin')->count() <= 1) {
                return redirect()->back()->with('error', 'Cannot delete the last administrator account!');
            }
            $userName = $user->name;
            $userEmail = $user->email;
            // Remove all roles before deleting
            $user->roles()->detach();

            // Delete the user
            $user->delete();
            return redirect()->back()->with('success', "User '{$userName}' ({$userEmail}) has been deleted.");
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Failed to delete user. Please try again.');
        }
    }
}
