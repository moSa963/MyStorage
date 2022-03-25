<?php

namespace App\Http\Controllers;

use App\Models\Group;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ProfileImageController extends Controller
{
    public function show_group(Request $request, Group $group){
        if (!$group?->image || ! Storage::exists('groups/'.$group->image)){
            return redirect("/images/user.png");
        }
        return Storage::download('groups/'.$group->image, $group->name.$group->image);
    }

    public function show_user(Request $request, User $user){

        if (Storage::exists('users/'.$user->username)){
            return Storage::download('users/'.$user->username);
        }

        return redirect("/images/user.png");
    }
}
