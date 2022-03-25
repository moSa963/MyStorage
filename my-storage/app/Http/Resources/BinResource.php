<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class BinResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {
        return [
            "id" => $this->id,
            "name" => $this->name,
            "size" => $this->size,
            "mime_type" => $this->mime_type,
            "extension" => $this->extension,
            "created_at" => $this->created_at,
            "updated_at" => $this->updated_at,
            "original_location" => $this->original_location,
            "group_id" => $this->user->master_group->id,
        ];
    }
}
