<?php

namespace Tests\Feature;

use App\Models\Group;
use App\Models\GroupUser;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class GroupUsersTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_get_list_of_group_members()
    {
        $user = User::factory()->create();

        $group = Group::factory()->Create([
            "user_id" => $user->id,
        ]);

        $members = User::factory()->times(5)->create();

        $members->each(function(User $member) use($group){
            GroupUser::create([
                'user_id' => $member->id,
                'group_id' => $group->id,
                'is_read_only' => rand(0, 1) == 1,
                'accepted' => true,
            ]);
        });

        Sanctum::actingAs($user);

        $response = $this->get('/api/group/'.$group->id.'/members');
        $response->assertSuccessful();
        $response->assertJsonCount(5, "data");
    }

    public function test_user_can_send_an_invite()
    {
        $user = User::factory()->create();

        $group = Group::factory()->Create([
            "user_id" => $user->id,
        ]);

        $invited_user = User::factory()->create();

        $data = [
            "is_read_only" => false,
        ];

        Sanctum::actingAs($user);

        $response = $this->post('/api/group/'.$group->id.'/request/'.$invited_user->username, $data);

        $response->assertSuccessful();
        $this->assertTrue(GroupUser::where("user_id", $invited_user->id)->where("group_id", $group->id)->exists());
    }

    public function test_user_can_accept_an_invite()
    {
        $user = User::factory()->create();

        $group = Group::factory()->Create([
            "user_id" => $user->id,
        ]);

        $invited_user = User::factory()->create();

        $invite = GroupUser::create([
            'user_id' => $invited_user->id,
            'group_id' => $group->id,
            'is_read_only' => true,
        ]);

        Sanctum::actingAs($invited_user);

        $response = $this->put('/api/group/request/'.$invite->id);

        $response->assertSuccessful();
    }

    public function test_user_can_reject_an_invite()
    {
        $user = User::factory()->create();

        $group = Group::factory()->Create([
            "user_id" => $user->id,
        ]);

        $invited_user = User::factory()->create();

        $invite = GroupUser::create([
            'user_id' => $invited_user->id,
            'group_id' => $group->id,
            'is_read_only' => true,
        ]);

        Sanctum::actingAs($invited_user);
        
        $response = $this->get('/api/group/member/'.$invite->id);

        $response->assertSuccessful();
    }

    public function test_user_can_leave_a_group()
    {
        $user = User::factory()->create();

        $group = Group::factory()->Create([
            "user_id" => $user->id,
        ]);

        $invited_user = User::factory()->create();

        $invite = GroupUser::create([
            'user_id' => $invited_user->id,
            'group_id' => $group->id,
            'is_read_only' => true,
            "accepted" => true,
        ]);

        Sanctum::actingAs($invited_user);

        $response = $this->get('/api/group/member/'.$invite->id);

        $response->assertSuccessful();
    }

    public function test_user_can_change_a_group_member_permission()
    {
        $user = User::factory()->create();

        $group = Group::factory()->Create([
            "user_id" => $user->id,
        ]);

        $member = User::factory()->create();

        $group_member = GroupUser::create([
            'user_id' => $member->id,
            'group_id' => $group->id,
            'is_read_only' => true,
            "accepted" => true,
        ]);

        Sanctum::actingAs($user);

        $response = $this->put('/api/group/member/'.$group_member->id."/write");

        $response->assertSuccessful();
        $this->assertFalse(boolval(GroupUser::find($group_member->id)->is_read_only));
    }
}
