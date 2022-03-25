<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class UpdateGroupRequest extends FormRequest
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

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'name'=> ['string', 'max:255', 'min:3', 'regex:/^[a-zA-Z]+((?![\/<>?|:]).)*$/'],
            'private'=> [ 'boolean'],
            'image' => ['image'],
        ];
    }
}
