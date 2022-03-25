<?php

namespace Tests\Feature;

use App\Models\Group;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class GroupTest extends TestCase
{
    use RefreshDatabase;
    
    public function test_user_can_get_group_information()
    {
        $user = User::factory()->create();

        $group = Group::factory()->create([
            "user_id" => $user->id,
        ]);

        Sanctum::actingAs($user);

        $response = $this->get('/api/group/'.$group->id);

        $response->assertSuccessful();
    }

    public function test_user_can_get_group_list()
    {
        $user = User::factory()->create();

        Group::factory(10)->create([
            "user_id" => $user->id,
        ]);

        Sanctum::actingAs($user);

        $response = $this->get('/api/group');

        $response->assertSuccessful();
    }

    public function test_user_can_create_a_group()
    {
        $user = User::factory()->create();

        $data = [
            'name' => "my new group",
            'private' => false,
        ];

        Sanctum::actingAs($user);

        $response = $this->post('/api/group', $data);

        $response->assertSuccessful();
    }

    public function test_user_can_update_a_group()
    {
        $user = User::factory()->create();

        $group = Group::factory()->create([
            "user_id" => $user->id,
        ]);

        $data = [
            'name' => "my new group",
            'private' => true,
        ];

        Sanctum::actingAs($user);

        $response = $this->post('/api/group/'.$group->id, $data);

        $response->assertSuccessful();
    }

    public function test_user_can_delete_group()
    {
        $user = User::factory()->create();

        $group = Group::factory()->create([
            "user_id" => $user->id,
        ]);

        Sanctum::actingAs($user);

        $response = $this->delete('/api/group/'.$group->id);

        $response->assertSuccessful();
    }

    public function test_user_can_not_delete_master_group()
    {
        $user = User::factory()->create();

        $group = $user->groups()->firstOrFail();

        Sanctum::actingAs($user);

        $response = $this->delete('/api/group/'.$group->id);

        $response->assertForbidden();
    }
}
