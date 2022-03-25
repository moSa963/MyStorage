<?php

namespace App\Policies;

use App\Models\Directory;
use App\Models\File;
use App\Models\Group;
use App\Models\User;
use App\Services\DirectoryService;
use Illuminate\Auth\Access\HandlesAuthorization;

class FilePolicy
{
    use HandlesAuthorization;

    public function view(User $user, File $file, Group $group) : bool
    {
        $member = $group->users()
            ->where('user_id', $user->id)
            ->where('accepted', true)->first();
                                
        if ($group->user_id == $user->id || (! $group->is_master && (! $file->bin()->exists() && (!$group->private || $member != null))) ){
            return true;
        }

        return false;
    }

    public function create(User $user, Directory $directory) : bool
    {
        $group = $directory->group;

        return $group->user_id == $user->id && $group->is_master;
    }

    public function move(User $user, File $file, Directory $from, Directory $to) : bool
    {
        return $from->directory_files()->where("file_id", $file->id)->exists()
                && $from->group_id == $to->group_id 
                && ($file->user_id == $user->id || $from->group->member($user)->firstOrFail()->is_read_only == false);
    }

    public function update(User $user, File $file) : bool
    {
        return $user->id == $file->user_id;
    }

    public function delete(User $user, File $file, Group $group) : bool
    {
        return $file->user_id == $user->id || (! $group->is_master && $user->groups_user()->where("group_id", $group->id)->where("is_read_only", false)->exists());
    }

    public function delete_reference(User $user, File $file, Group $group) : bool
    {
        return $file->user_id == $user->id ||
                 (! $group->is_master && $group->users()->where("user_id", $user->id)->where("is_read_only", false)->exists());
    }
    
}
