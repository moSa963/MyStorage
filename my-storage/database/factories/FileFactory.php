<?php

namespace Database\Factories;

use App\Models\DirectoryFile;
use App\Models\File;
use App\Models\User;
use App\Models\Directory;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Storage;

class FileFactory extends Factory
{

    public function definition()
    {
        return [
            'user_id' => $this->faker->numberBetween(1, 20),
            'name' => $this->faker->unique()->name(),
            'storage_path' => "",
            'extension' => "txt",
            'size' => 0,
            'mime_type' => "",
        ];
    }

    public function configure()
    {
        return $this->afterMaking(function (File $file) {
            $user = $file->user;
            $path = $user->username."/".uniqid($user->username).".txt";
            Storage::put($path, $this->faker->paragraph());
            $file->storage_path = $path;
            $file->size = Storage::size($path);
            $file->mime_type = Storage::mimeType($path);
        })->afterCreating(function (File $file) {
            DirectoryFile::create([
                'directory_id' => Directory::where("group_id", $file->user->groups()->where("is_master", true)->first()->id)->first()->id,
                'file_id' => $file->id,
            ]);
        });
    }
}
