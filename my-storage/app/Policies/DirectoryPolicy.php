<?php

namespace App\Policies;

use App\Models\Directory;
use App\Models\Group;
use App\Models\GroupUser;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class DirectoryPolicy
{
    use HandlesAuthorization;

    public function create(User $user, Group $group)
    {
        if ($group->user_id == $user->id){
            return true;
        }

        $member = $group->users()
                    ->where('user_id', $user->id)
                    ->where('accepted', true)->first();
                                
        if ($member && ! $group->is_master && !$member->is_read_only){
            return true;
        }

        return false;
    }

    public function move(User $user, Directory $directory, Directory $destination)
    {
        return $directory->group_id == $destination->group_id 
                && $this->create($user, $directory->group)
                && $directory->id != $destination->id 
                && !str_starts_with($destination->location, $directory->location.'/'.$directory->name);
    }


    public function delete(User $user, Directory $directory) : bool
    {
        return $directory->location != "" && 
            ($user->id == $directory->group->user_id ||
            $user->groups_user()->where("group_id", $directory->group_id)->where("is_read_only", false)->exists());
    }
}
