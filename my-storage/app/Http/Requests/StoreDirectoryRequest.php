<?php

namespace App\Http\Requests;

use App\Models\Directory;
use App\Models\Group;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class StoreDirectoryRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return Auth::check();
    }

    public function store(Group $group, Directory $parent){
        return Directory::create([
            'group_id'=> $group->id,
            'name'=> $this->name,
            'location' => $parent->location.'/'.$parent->name,
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
            'name' => ['required', 'max:255', 'min:3', 'regex:/^[A-Za-z]+((?![\/<>?|:]).)*$/'],
        ];
    }
}
