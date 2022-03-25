<?php

namespace Tests\Feature;

use App\Models\Group;
use App\Models\GroupUser;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class NotificationTest extends TestCase
{

    use RefreshDatabase;

    public function test_user_can_get_notification()
    {
        $user1 = User::factory()->create();
        $user2 = User::factory()->create();

        $user1_groups = Group::factory()->times(5)->create([
            "user_id" => $user1->id,
        ]);

        $user2_groups = Group::factory()->times(5)->create([
            "user_id" => $user2->id,
        ]);

        $user1_groups->each(function($group) use($user2){
            GroupUser::create([
                'user_id' => $user2->id,
                'group_id' => $group->id,
                'is_read_only' => rand(0, 1) === 1,
                'accepted' => false,
            ]);
        });

        $user2_groups->each(function($group) use($user1){
            GroupUser::create([
                'user_id' => $user1->id,
                'group_id' => $group->id,
                'is_read_only' => rand(0, 1) === 1,
                'accepted' => false,
            ]);
        });

        Sanctum::actingAs($user1);

        $response = $this->get('/api/notification');

        $response->assertSuccessful();
        $response->assertJsonCount(5, "data.invites");
        $response->assertJsonCount(5, "data.requests");
    }
}
