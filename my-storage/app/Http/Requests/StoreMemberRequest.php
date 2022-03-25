<?php

namespace App\Http\Requests;

use App\Models\Group;
use App\Models\GroupUser;
use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class StoreMemberRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    public function store(User $user, Group $group) : GroupUser{
        return GroupUser::firstOrCreate([
            'user_id' => $user->id,
            'group_id' => $group->id,
        ],[
            'is_read_only' => $this->is_read_only ? true : false
        ]);
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'is_read_only' => ['boolean'],
        ];
    }
}
