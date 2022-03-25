<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateDirectoriesFilesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('directories_files', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('directory_id')->unsigned();
            $table->bigInteger('file_id')->unsigned();
            $table->foreign('directory_id')->references('id')->on('directories')->cascadeOnDelete();
            $table->foreign('file_id')->references('id')->on('files')->cascadeOnDelete();

            $table->unique(['directory_id', 'file_id']);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('directories_files');
    }
}
