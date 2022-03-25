<!DOCTYPE html>
<html >
    <head>
        <meta charset="utf-8">
  
        <style>
            body{
            }
            h1{
                color: blue;
            }
            .codeCont{
                text-align: center;
                padding: 10px;
                border: 1px dashed black;
            }
        </style>
    </head>
    <body>
        <h2>Hello {{$user->first_name.' '.$user->last_name}}</h2>
        <h4>To complete your sign up, we just need to verify your email address: </h4>
        <div class="codeCont">
            <h1>{{ $code }}</h1>
        </div>
    </body>
</html>
