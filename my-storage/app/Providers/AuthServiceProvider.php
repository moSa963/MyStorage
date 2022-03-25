<?php

namespace App\Providers;

use App\Models\Directory;
use App\Models\File;
use App\Models\Group;
use App\Models\GroupUser;
use App\Policies\BinPolicy;
use App\Policies\DirectoryPolicy;
use App\Policies\FilePolicy;
use App\Policies\GroupPolicy;
use App\Policies\GroupUserPolicy;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Gate;
use PhpParser\Node\Stmt\GroupUse;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The policy mappings for the application.
     *
     * @var array
     */
    protected $policies = [
        Bin::class => BinPolicy::class,
        Directory::class => DirectoryPolicy::class,
        Group::class => GroupPolicy::class,
        GroupUser::class => GroupUserPolicy::class,
        File::class => FilePolicy::class,
    ];

    /**
     * Register any authentication / authorization services.
     *
     * @return void
     */
    public function boot()
    {
        $this->registerPolicies();

        //
    }
}
