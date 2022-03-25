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

class FileGroupTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_reference_a_file_in_a_group()
    {
        $user = User::factory()->create();

        $file = File::factory()->create([
            "user_id" => $user->id,
        ]);

        $group = Group::factory()->create([
            "user_id" => $user->id,
        ]);
        
        $directory = $group->directories()->firstOrFail();

        Sanctum::actingAs($user);

        $response = $this->post('/api/directory/'.$directory->id.'/reference/file/'.$file->id);

        $response->assertSuccessful();

        $this->assertTrue(DirectoryFile::where("file_id", $file->id)->where("directory_id", $directory->id)->exists());

        Storage::delete($file->storage_path);
    }
}
