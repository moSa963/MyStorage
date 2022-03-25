<?php

namespace App\Http\Controllers;

use App\Http\Resources\DirectoryContnetResource;
use App\Models\Group;
use App\Services\DirectoryService;
use Illuminate\Http\Request;

class GroupDirectoriesController extends Controller
{
    public function index(Request $request, Group $group, $path)
    {
        $this->authorize("view", $group);

        $directory = DirectoryService::get_directory($group, $path);

        return new DirectoryContnetResource($directory);
    }
}
