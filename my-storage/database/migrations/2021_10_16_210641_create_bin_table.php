<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateBinTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('bin', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('file_id')->unsigned()->unique();
            $table->foreign('file_id')->references('id')->on('files')->cascadeOnDelete();
            $table->string('original_location');
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
        Schema::dropIfExists('bin');
    }
}
