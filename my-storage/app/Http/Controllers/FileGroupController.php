<?php

namespace App\Http\Controllers;

use App\Http\Resources\FileResource;
use App\Models\Directory;
use App\Models\File;
use App\Services\FileService;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class FileGroupController extends Controller
{
    public function store(Request $request, Directory $directory, File $file){
        $this->authorize("write", $directory->group);

        try{
            FileService::reference(Auth::user(), $file, $directory);
        } catch(Exception ) {
            abort(403, "This file is already in this group.");
        }

        return new FileResource($file);
    }
}
