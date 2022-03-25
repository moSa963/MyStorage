<?php

namespace App\Http\Requests;

use App\Models\Directory;
use App\Models\File;
use App\Services\DirectoryService;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class UpdateFileRequest extends FormRequest
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

    public function update(File $file){
        $directory = $file->master_directory()->firstOrFail();

        if (DirectoryService::name_exists($directory, $this->name, $file->extension)){
            abort(400, "file with the same name exists.");
        }

        $file->update([
            "name" => $this->name,
        ]);

        return $file;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'name'=> ['required', 'string', 'max:255', 'min:1', 'regex:/^[a-zA-Z0-9]+((?![\/<>?|:]).)*$/'],
        ];
    }
}
