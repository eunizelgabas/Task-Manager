<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;

use App\Models\Project;
use App\Models\Task;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // \App\Models\User::factory(10)->create();

        // \App\Models\User::factory()->create([
        //     'name' => 'Test User',
        //     'email' => 'test@example.com',
        // ]);

         $this->call(RoleSeeder::class);

         // Create Admin user
        $admin = User::create([
            'name' => 'Admin User',
            'email' => 'admin@example.com',
            'password' => Hash::make('password'),
        ]);
        $admin->assignRole('Admin');
        // Create manager users
        $manager1 = User::create([
            'name' => 'Manager One',
            'email' => 'manager1@example.com',
            'password' => Hash::make('password'),
        ]);
        $manager1->assignRole('Manager');

        $manager2 = User::create([
            'name' => 'Manager Two',
            'email' => 'manager2@example.com',
            'password' => Hash::make('password'),
        ]);
        $manager2->assignRole('Manager');
        // Create member users
        $member1 = User::create([
            'name' => 'Member One',
            'email' => 'member1@example.com',
            'password' => Hash::make('password'),
        ]);
        $member1->assignRole('Member');
        $member2 = User::create([
            'name' => 'Member Two',
            'email' => 'member2@example.com',
            'password' => Hash::make('password'),
        ]);
        $member2->assignRole('Member');

        // Create projects
        $project1 = Project::create([
            'name' => 'Website Redesign',
            'description' => 'Complete redesign of company website',
            'manager_id' => $manager1->id,
        ]);
        $project2 = Project::create([
            'name' => 'Mobile App Development',
            'description' => 'Develop new mobile application',
            'manager_id' => $manager2->id,
        ]);

        // Create tasks
        Task::create([
            'title' => 'Design Homepage',
            'description' => 'Create new homepage design',
            'project_id' => $project1->id,
            'assigned_to' => $member1->id,
            'status' => 'In Progress',
        ]);
        Task::create([
            'title' => 'Implement Login',
            'description' => 'Implement user authentication',
            'project_id' => $project2->id,
            'assigned_to' => $member2->id,
            'status' => 'To do',
        ]);
        Task::create([
            'title' => 'Write Documentation',
            'description' => 'Document API endpoints',
            'project_id' => $project2->id,
            'assigned_to' => $member1->id,
            'status' => 'Done',
        ]);
    }

}
