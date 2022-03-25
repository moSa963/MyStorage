<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreDirectoryRequest;
use App\Http\Requests\UpdateFolderRequest;
use App\Http\Resources\DirectoryContnetResource;
use App\Http\Resources\DirectoryResource;
use App\Models\Directory;
use App\Models\Group;
use App\Services\DirectoryService;
use Exception;
use Illuminate\Http\Request;

class DirectoriesController extends Controller
{
    public function index(Request $request, $path = ""){
        $group = $request->user()->master_group;

        $this->authorize("view", $group);
        
        $directory = DirectoryService::get_directory($group, $path);

        return new DirectoryContnetResource($directory);
    }

    public function store(StoreDirectoryRequest $request, Group $group, Directory $directory){
        $this->authorize("create", [Directory::class, $group]);
       
        $dir = $request->store($group, $directory);

        return new DirectoryResource($dir);
    }

    public function destroy(Request $request, Directory $directory){
        $this->authorize("delete", $directory);

        DirectoryService::delete($directory);

        return response()->noContent();
    }

    public function move(Request $request, Directory $directory, Directory $destination)
    {
        $this->authorize("move", [$directory, $destination]);

        DirectoryService::move_location($directory, $destination);

        return response()->noContent();
    }

    public function update(UpdateFolderRequest $request, Directory $directory)
    {
        $this->authorize("write", $directory->group);

        try{
            $directory = DirectoryService::rename($directory, $request->name);
            return new DirectoryResource($directory);
        }catch(Exception) {
            abort(400, "This name already exists.");
        }
    }
}
