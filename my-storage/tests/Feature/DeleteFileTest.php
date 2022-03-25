<?php

namespace Tests\Feature;

use App\Models\Bin;
use App\Models\Directory;
use App\Models\DirectoryFile;
use App\Models\File;
use App\Models\Group;
use App\Models\GroupUser;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Support\Facades\Storage;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class DeleteFileTest extends TestCase
{
    public function test_user_can_delete_a_file()
    {
        $user = User::factory()->create();

        $file = File::factory()->create([
            "user_id" => $user->id,
        ]);

        $directory = $file->directories()->firstOrFail();

        Bin::create([
            'file_id' => $file->id,
            'original_location' => "root",
        ]);

        Sanctum::actingAs($user);

        $this->assertTrue(Storage::exists($file->storage_path));

        $response = $this->delete('/api/group/'.$directory->group_id.'/file/'.$file->id);

        $response->assertSuccessful();

        $this->assertTrue(!Storage::exists($file->storage_path));
    }

    public function test_user_can_delete_his_own_file_from_a_group()
    {
        $user = User::factory()->create();

        $file = File::factory()->create([
            "user_id" => $user->id,
        ]);

        $user2 = User::factory()->create();

        $group = Group::factory()->create([
            "user_id" => $user2->id,
        ]);

        GroupUser::create([
            "user_id" => $user->id,
            "group_id" => $group->id,
            'is_read_only' => true,
            'accepted' => true,
        ]);

        DirectoryFile::create([
            "file_id" => $file->id,
            "directory_id" => $group->directories()->firstOrFail()->id,
        ]);

        Sanctum::actingAs($user);

        $this->assertTrue(Storage::exists($file->storage_path));

        $response = $this->delete('/api/group/'.$group->id.'/file/'.$file->id);

        $response->assertSuccessful();
        $this->assertTrue(File::where("id", $file->id)->exists());
        $this->assertTrue(Storage::exists($file->storage_path));

        Storage::delete($file->storage_path);
    }

    public function test_user_with_write_permission_can_delete_file_from_a_group()
    {
        $user = User::factory()->create();

        $user2 = User::factory()->create();

        $file = File::factory()->create([
            "user_id" => $user2->id,
        ]);

        $group = Group::factory()->create([
            "user_id" => $user2->id,
        ]);

        GroupUser::create([
            "user_id" => $user->id,
            "group_id" => $group->id,
            'is_read_only' => false,
            'accepted' => true,
        ]);

        DirectoryFile::create([
            "file_id" => $file->id,
            "directory_id" => $group->directories()->firstOrFail()->id,
        ]);

        Sanctum::actingAs($user);

        $this->assertTrue(Storage::exists($file->storage_path));

        $response = $this->delete('/api/group/'.$group->id.'/file/'.$file->id);

        $response->assertSuccessful();
        $this->assertTrue(File::where("id", $file->id)->exists());
        $this->assertTrue(Storage::exists($file->storage_path));

        Storage::delete($file->storage_path);
    }

    public function test_user_without_write_permission_can_not_delete_file_from_a_group()
    {
        $user = User::factory()->create();

        $user2 = User::factory()->create();

        $file = File::factory()->create([
            "user_id" => $user2->id,
        ]);

        $group = Group::factory()->create([
            "user_id" => $user2->id,
        ]);

        GroupUser::create([
            "user_id" => $user->id,
            "group_id" => $group->id,
            'is_read_only' => true,
            'accepted' => true,
        ]);

        DirectoryFile::create([
            "file_id" => $file->id,
            "directory_id" => $group->directories()->firstOrFail()->id,
        ]);

        Sanctum::actingAs($user);

        $this->assertTrue(Storage::exists($file->storage_path));

        $response = $this->delete('/api/group/'.$group->id.'/file/'.$file->id);

        $response->assertStatus(403);
        $this->assertTrue(File::where("id", $file->id)->exists());
        $this->assertTrue(Storage::exists($file->storage_path));

        Storage::delete($file->storage_path);
    }

    public function test_user_can_not_delete_file_he_does_not_own()
    {
        $user = User::factory()->create();
        $user2 = User::factory()->create();

        $file = File::factory()->create([
            "user_id" => $user2->id,
        ]);

        $directory = $file->directories()->firstOrFail();

        Sanctum::actingAs($user);

        $this->assertTrue(Storage::exists($file->storage_path));

        $response = $this->delete('/api/group/'.$directory->group_id.'/file/'.$file->id);

        $response->assertStatus(403);

        $this->assertTrue(File::where("id", $file->id)->exists());
        $this->assertTrue(Storage::exists($file->storage_path));

        Storage::delete($file->storage_path);
    }
}
