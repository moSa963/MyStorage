<?php

namespace Tests\Feature;

use App\Models\Directory;
use App\Models\DirectoryFile;
use App\Models\File;
use App\Models\Group;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Support\Facades\Storage;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class DirectoryTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_get_files()
    {
        $user = User::factory()->create();

        $files = File::factory()->times(10)->create([
            "user_id" => $user->id,
        ]);

        $group = $user->groups()->firstOrFail();

        Directory::create([ 'group_id' => $group->id, 'name' => "f1", 'location' => "/root" ]);
        Directory::create([ 'group_id' => $group->id, 'name' => "f2", 'location' => "/root" ]);

        Sanctum::actingAs($user);

        $response = $this->get('/api/directory/root');

        $response->assertSuccessful();
        $response->assertJsonCount(10, "data.files");
        $response->assertJsonCount(2, "data.directories");

        Storage::delete($files->pluck("storage_path"));
    }

    public function test_user_can_get_files_from_another_group()
    {
        $user = User::factory()->create();

        $files = File::factory()->times(10)->create([
            "user_id" => $user->id,
        ]);

        $group = Group::factory()->create([
            "user_id" => $user->id,
        ]);

        $directory = $group->directories[0];

        $files->each(function(File $file) use($directory){
            $file->directories_file()->delete();
            DirectoryFile::create([
                'directory_id' => $directory->id,
                'file_id' => $file->id,
            ]);
        });

        Directory::create([ 'group_id' => $group->id, 'name' => "f1", 'location' => "/root" ]);
        Directory::create([ 'group_id' => $group->id, 'name' => "f2", 'location' => "/root" ]);

        Sanctum::actingAs($user);

        $response = $this->get('/api/group/'.$group->id.'/directory/root');

        $response->assertSuccessful();

        $response->assertJsonCount(10, "data.files");
        $response->assertJsonCount(2, "data.directories");

        Storage::delete($files->pluck("storage_path"));
    }

    public function test_user_can_store_directory()
    {
        $user = User::factory()->create();

        $group = $user->groups[0];

        $directory = $group->directories[0];

        $data = [
            "name" => "new folder",
        ];

        Sanctum::actingAs($user);

        $response = $this->post('/api/group/'.$group->id.'/directory/'.$directory->id, $data);

        $response->assertSuccessful();
        $this->assertTrue(Directory::where("name", "new folder")->where("location", "/root")->exists());
    }

    public function test_user_can_rename_directory()
    {
        $user = User::factory()->create();

        $group = $user->groups()->firstOrFail();

        $directory = Directory::create([ 'group_id' => $group->id, 'name' => "folder1", 'location' => "/root" ]);
        
        $data = [
            "name" => "new folder name",
        ];

        Sanctum::actingAs($user);

        $response = $this->post('/api/directory/'.$directory->id."/update", $data);

        $response->assertSuccessful();
        $this->assertTrue($data["name"] === Directory::findOrFail($directory->id)->name);
    }

    public function test_user_can_move_directory_into_another()
    {
        $user = User::factory()->create();

        $group = $user->groups()->firstOrFail();

        $directory = Directory::create([ 'group_id' => $group->id, 'name' => "folder1", 'location' => "/root" ]);
        $directory2 = Directory::create([ 'group_id' => $group->id, 'name' => "folder2", 'location' => "/root" ]);

        Sanctum::actingAs($user);

        $response = $this->put('/api/directory/'.$directory->id."/move/".$directory2->id);

        $response->assertSuccessful();
        $this->assertTrue(Directory::findOrFail($directory->id)->location === $directory2->location."/".$directory2->name);
    }
}
