<?php

namespace App\Http\Requests;

use App\Models\Group;
use App\Models\User;
use App\Models\Directory;
use Illuminate\Auth\Events\Registered;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class RegisterStoreRequest extends FormRequest
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

    public function store() : User
    {
        $user = User::create([
            'first_name' => $this->first_name,
            'last_name' => $this->last_name,
            'username' => $this->username,
            'email' => $this->email,
            'password' => Hash::make($this->password),
        ]);

        event(new Registered($user));

        return $user;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'first_name' => ['required', 'string', 'min:3', 'max:50'],
            'last_name' => ['required', 'string', 'min:3', 'max:50'],
            'username' => ['required', 'string', 'min:3', 'max:50', 'regex:/^[A-Za-z]+([._-]?[A-Za-z0-9]+)*$/', 'unique:users'],
            'email' => ['required', 'email', 'unique:users', 'regex:/^[A-Za-z]+/'],
            'password' => ['required', 'string', 'min:8', 'max:100', 'confirmed'],
        ];
    }
}

