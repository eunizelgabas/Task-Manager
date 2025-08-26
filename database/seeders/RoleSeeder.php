<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
         // Reset cached roles and permissions
    $admin = Role::create(['name' => 'Admin']);
    $manager = Role::create(['name' => 'Manager']);
    $member = Role::create(['name' => 'Member']);

    // Create permissions
    $permissions = [
        'manage users',
        'manage projects',
        'manage tasks',
        'assign tasks',
        'update assigned tasks',
    ];

    foreach ($permissions as $perm) {
        Permission::firstOrCreate(['name' => $perm]);
    }

    // Assign permissions
    $admin->givePermissionTo(Permission::all());

    $manager->givePermissionTo([
        'manage projects',
        'manage tasks',
        'assign tasks',
    ]);

    $member->givePermissionTo([
        'update assigned tasks',
    ]);
    }
}
