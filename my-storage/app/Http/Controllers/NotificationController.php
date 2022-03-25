<?php

namespace App\Http\Controllers;

use App\Http\Resources\InviteResource;
use App\Http\Resources\RequestResource;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    public function index(Request $request) {
        $user = $request->user();

        $invites = $user->invites;
        $requests = $user->requests;

        return response()->json([
            "data" => [
                "invites" => InviteResource::collection($invites),
                "requests" => RequestResource::collection($requests),
            ]
        ]);
    }
}
