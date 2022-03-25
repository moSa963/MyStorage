<?php

namespace App\Policies;

use App\Models\Group;
use App\Models\GroupUser;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class GroupUserPolicy
{
    use HandlesAuthorization;

    public function create(User $user, Group $group, User $new_member) : bool
    {
        return $user->id != $new_member->id && ! $group->is_master && $group->user_id == $user->id && $group->user_id != $new_member->id;
    }

    public function update(User $user, GroupUser $groupUser) : bool
    {
        return $user->id == $groupUser->user_id;
    }

    public function delete(User $user, GroupUser $groupUser) : bool
    {
        return in_array($user->id, [$groupUser->user_id,  $groupUser->group->user_id]);
    }
}
