<?php

namespace Tests\Feature;

use App\Models\Directory;
use App\Models\File;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class FilesTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_download_file()
    {
        $user = User::factory()->create();

        $file = File::factory()->create([
            "user_id" => $user->id,
        ]);

        $directory = $file->directories_file()->firstOrFail()->directory;

        Sanctum::actingAs($user);

        $response = $this->get('/api/group/'.$directory->group->id.'/file/'.$file->id);

        $response->assertSuccessful();

        Storage::delete($file->storage_path);
    }

    public function test_user_can_get_a_file_information()
    {
        $user = User::factory()->create();

        $file = File::factory()->create([
            "user_id" => $user->id,
        ]);

        $directory = $file->directories_file()->firstOrFail()->directory;

        Sanctum::actingAs($user);

        $response = $this->get('/api/group/'.$directory->group->id.'/file/'.$file->id."/info");

        $response->assertSuccessful();

        Storage::delete($file->storage_path);
    }

    public function test_user_can_store_a_new_file()
    {
        $user = User::factory()->create();
        
        $data = [
            'name' => "my_file",
            'extension' => "txt",
            'file' => UploadedFile::fake()->create("my_file.txt", 25, "text/plain"),
        ];

        $directory =  $user->master_group->directories()->firstOrFail();

        Sanctum::actingAs($user);

        $response = $this->post('/api/directory/'.$directory->id.'/file', $data);

        $response->assertSuccessful();

        $file = File::where("name", "my_file")->firstOrFail();

        $this->assertTrue(File::count() > 0);
        $this->assertTrue($file->user_id == $user->id);
        $this->assertTrue(Storage::exists($file->storage_path));

        Storage::delete($file->storage_path);
    }

    public function test_user_can_update_file()
    {
        $user = User::factory()->create();

        $file = File::factory()->create([
            "user_id" => $user->id,
        ]);

        Sanctum::actingAs($user);

        $this->assertTrue(Storage::exists($file->storage_path));

        $data = [
            "name" => "new name",
        ];

        $response = $this->post('/api/file/'.$file->id.'/update', $data);

        $response->assertSuccessful();

        $response->assertJsonPath("data.name", $data["name"]);

        Storage::delete($file->storage_path);
    }

    public function test_user_can_move_a_file()
    {
        $user = User::factory()->create();

        $file = File::factory()->create([
            "user_id" => $user->id,
        ]);

        Sanctum::actingAs($user);

        $directory = Directory::where("group_id", $user->groups()->where("is_master", true)->first()->id)->first();

        $to = Directory::create([
            'group_id' => $directory->group->id,
            'name' => "new_folder",
            'location' => "root",
        ]);

        $response = $this->put('/api/file/'.$file->id.'/move/'.$directory->id.'/'.$to->id);

        $response->assertSuccessful();

        $directories_file = $file->directories_file()->get();

        $this->assertTrue(sizeof($directories_file) === 1);
        $this->assertTrue($directories_file[0]->directory->name === "new_folder");
        Storage::delete($file->storage_path);
    }
}
