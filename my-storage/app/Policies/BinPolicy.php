<?php

namespace App\Policies;

use App\Models\Bin;
use App\Models\Group;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class BinPolicy
{
    use HandlesAuthorization;

    public function create(User $user, Group $group) : bool
    {
        return $group->user_id == $user->id && $group->is_master;
    }

    public function restore(User $user, Bin $bin) : bool
    {
        return $bin->file->user_id == $user->id;
    }

}
