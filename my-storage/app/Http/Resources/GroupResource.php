<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class GroupResource extends JsonResource
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
            "user_id" => $this->user_id,
            "is_master" => $this->is_master,
            "private" => $this->private,
            "is_read_only" => ! ($this->user_id == $request->user()->id || ! $request->user()->joined_groups()->where("group_id", $this->id)->first()?->is_read_only),
        ];
    }
}
