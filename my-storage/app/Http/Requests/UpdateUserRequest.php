<?php

namespace App\Http\Requests;

use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Storage;

class UpdateUserRequest extends FormRequest
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

    public function update(User $user){
        if (isset($this->image)){
            Storage::putFileAs('users', $this->validated()["image"], $user->username);
        }
    }

    public function rules()
    {
        return [
            'image' => ['image'],
        ];
    }
}
