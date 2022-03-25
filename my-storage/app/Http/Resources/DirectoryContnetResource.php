<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class DirectoryContnetResource extends JsonResource
{

    
    public function toArray($request)
    {
        return [
            "parent" => new DirectoryResource($this->resource),
            "group" => new GroupResource($this->group),
            "files" => FileResource::collection($this->files),
            "directories" => DirectoryResource::collection($this->directories),
        ];
    }
}
