<?php

namespace App\Policies;

use App\Models\Group;
use App\Models\GroupUser;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class GroupPolicy
{
    use HandlesAuthorization;

    public function view(User $user, Group $group)
    {
        if ($group->user_id == $user->id){
            return true;
        }

        if ($group->is_master){
            return false;
        }
        
        if (! $group->private){
            return true;
        }

        $member = GroupUser::where('group_id', $group->id)
                                ->where('user_id', $user->id)
                                ->where('accepted', true)->first();
        if ($member){
            return true;
        }

        return false;
    }

    public function write(User $user, Group $group){
        if ($group->user_id == $user->id){
            return true;
        }

        if ($group->is_master){
            return false;
        }

        $member = $group->users()->where("user_id", $user->id)->firts();

        if ($member && ! $member->is_read_only){
            return true;
        }

        return false;
    }

    public function update(User $user, Group $group)
    {
        return $user->id == $group->user_id;
    }

    public function delete(User $user, Group $group)
    {
        return $group->user_id == $user->id && ! $group->is_master;
    }
}
