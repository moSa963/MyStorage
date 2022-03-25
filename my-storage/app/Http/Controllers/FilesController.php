<?php

namespace App\Http\Controllers;

use App\Http\Requests\CreateFileRequest;
use App\Http\Requests\UpdateFileRequest;
use App\Http\Resources\FileResource;
use App\Models\Directory;
use App\Models\File;
use App\Models\Group;
use App\Services\FileService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class FilesController extends Controller
{
    public function index(Request $request, Group $group, File $file)
    {
        $this->authorize("view", [$file, $group]);

        return Storage::download($file->storage_path, $file->name.'.'.$file->extension);
    }

    public function show(Request $request, Group $group, File $file)
    {
        $this->authorize("view", [$file, $group]);

        return [
            "data" => [
                "file" => new FileResource($file),
                "groups" => $file->groups()->get(),
            ]
        ];
    }

    public function store(CreateFileRequest $request, Directory $directory){
        $this->authorize("create", [File::class, $directory]);

        $file = $request->store(Auth::user(), $directory);

        return new FileResource($file);
    }

    public function destroy(Request $request, Group $group, File $file){
        $this->authorize("delete", [$file, $group]);

        FileService::deleteFile($group, $file);

        return response()->noContent();
    }

    public function update (UpdateFileRequest $request, File $file)
    {
        $this->authorize("update", $file);
        
        $file = $request->update($file);

        return new FileResource($file);
    }

    public function move(Request $request, File $file, Directory $from, Directory $to)
    {
        $this->authorize("move", [$file, $from, $to]);

        FileService::move_location($file, $from, $to);

        return response()->noContent();
    }
}
