<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreMemberRequest;
use App\Http\Resources\GroupMemberResource;
use App\Models\Group;
use App\Models\GroupUser;
use App\Models\User;
use App\Services\DirectoryFileService;
use Illuminate\Http\Request;

class GroupMembersController extends Controller
{
    public function show(Request $request, Group $group)
    {   
        $this->authorize("view", $group);

        $members = $group->users()->get();

        return GroupMemberResource::collection($members);
    }

    public function store(StoreMemberRequest $request, Group $group, User $user){
        $this->authorize("create", [GroupUser::class, $group, $user]);

        return new GroupMemberResource($request->store($user, $group));
    }

    public function update(Request $request, $member_id){
        $member = GroupUser::findOrFail($member_id);
        
        $this->authorize("update", $member);

        $member->update([
            "accepted" => true,
        ]);

        return response()->noContent();
    }

    public function update_permission(Request $request, $member_id, $permission){
        $member = GroupUser::findOrFail($member_id);

        $this->authorize("update", $member->group);

        $member->update([
            "is_read_only" => $permission == "write" ? false : true,
        ]);

        return response()->noContent();
    }

    public function destroy(Request $request,  $id){
        $member = GroupUser::findOrFail($id);
        
        $this->authorize("delete", $member);

        DirectoryFileService::delete_if_belong_to($member->user, $member->group);

        $member->delete();

        return response()->noContent();
    }
}
