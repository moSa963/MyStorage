<?php

namespace Tests\Feature;

use App\Models\Bin;
use App\Models\File;
use App\Models\User;
use App\Models\Directory;
use App\Models\DirectoryFile;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Support\Facades\Storage;
use Laravel\Sanctum\Sanctum;
use SebastianBergmann\Environment\Console;
use Tests\TestCase;

class BinTest extends TestCase
{
    use RefreshDatabase;
    
    public function test_user_can_get_list_of_files()
    {
        $user = User::factory()->create();

        $files = File::factory()->times(10)->create([
            "user_id" => $user->id,
        ]);

        $files->each(function(File $file) {
            Bin::create([
                'file_id' => $file->id,
                'original_location' => "/root",
            ]);
        });

        Sanctum::actingAs($user);

        $response = $this->get('/api/bin');

        $response->assertSuccessful();

        Storage::delete($files->pluck("storage_path"));
    }

    public function test_user_can_send_a_file_to_bin()
    {
        $user = User::factory()->create();

        $file = File::factory()->create([
            "user_id" => $user->id,
        ]);
        
        $directory = $file->directories_file[0]->directory;

        Sanctum::actingAs($user);

        $response = $this->delete('/api/group/'.$directory->group_id.'/file/'.$file->id);

        $response->assertSuccessful();

        Storage::delete($file->storage_path);
    }

    public function test_user_can_send_a_directory_to_bin()
    {
        $user = User::factory()->create();
        
        $directory = Directory::create([
            'group_id' => $user->groups()->firstOrFail()->id,
            'name' => "folder1",
            'location' => "/root",
        ]);

        $files = File::factory()->times(10)->create([
            "user_id" => $user->id,
        ]);

        $files->each(function(File $file) use($directory){
            $file->directories_file()->delete();
            DirectoryFile::create([
                'directory_id' => $directory->id,
                'file_id' => $file->id,
            ]);
        });

        Sanctum::actingAs($user);

        $response = $this->delete('/api/directory/'.$directory->id);

        $response->assertSuccessful();

        $this->assertTrue(sizeof(Bin::all()) === 10);

        Storage::delete($files->pluck("storage_path"));
    }
    
    public function test_user_can_restore_a_file_from_bin()
    {
        $user = User::factory()->create();

        $file = File::factory()->create([
            "user_id" => $user->id,
        ]);

        Bin::create([
            'file_id' => $file->id,
            'original_location' => "/root",
        ]);

        Sanctum::actingAs($user);

        $response = $this->put('/api/bin/file/'.$file->id);

        $response->assertSuccessful();
        $this->assertTrue($file->bin == null);
        Storage::delete($file->storage_path);
    }

    public function test_user_can_empty_the_bin()
    {
        $user = User::factory()->create();

        $files = File::factory()->times(10)->create([
            "user_id" => $user->id,
        ]);

        $files->each(function(File $file) {
            Bin::create([
                'file_id' => $file->id,
                'original_location' => "/root",
            ]);
        });

        Sanctum::actingAs($user);

        $response = $this->delete('/api/bin');

        $response->assertSuccessful();
        $this->assertTrue(sizeof(Bin::all()) === 0);

        foreach($files as $file){
            $this->assertTrue(!Storage::exists($file->storage_path));
        } 
    }
}
