<?php

namespace App\Http\Controllers;

use App\Http\Resources\BinResource;
use App\Models\DirectoryFile;
use App\Models\File;
use App\Services\DirectoryService;
use App\Services\FileService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class RecycleBinController extends Controller
{
    public function index(){
        $files = File::select('files.*', 'bin.original_location')
                        ->join('bin', 'bin.file_id', '=', 'files.id')
                        ->where('files.user_id', Auth::user()->id)
                        ->get();

        return BinResource::collection($files);
    }

    /**
     * restor a file from the recycle bin
     */
    public function update(Request $request, File $file){

        $bin = $file->bin()->firstOrFail();

        $this->authorize("restore", $bin);

        $group = $request->user()->master_group;

        $directory = DirectoryService::findOrCreatePath($group->id, $bin->original_location);
        
        if (DirectoryService::name_exists($directory, $file->name, $file->extension)){
            abort(400, 'a file with the same name exists');
        }
        
        $file->bin->delete();

        DirectoryFile::firstOrCreate([
            'directory_id' => $directory->id,
            'file_id' => $file->id,
        ]);

        return response()->noContent();
    }

    public function destroy(){
        $files = File::select('files.*')
                        ->join('bin', 'bin.file_id', '=', 'files.id')
                        ->where('files.user_id', Auth::user()->id)
                        ->get();
        
        FileService::deleteFiles($files);

        return response()->noContent();
    }
}
