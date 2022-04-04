---
layout: post
title: The configuration of multi-ssh keygens
date: 2021-07-29 13:30:55:24.000000000 +09:00
tags: Linux
---

I have two keygens, one for github no password login, while the other for the remote server login. When I have generated key as usual:

```bash
$ssh-keygen -t rsa
```

Ask me if overwrite the default keygen (of course not!).

So I make a new keygen file named rsa2, whatever.

However, after the command-line:

```bash
$cat ~/.ssh/id_rsa2.pub | ssh -p $PORT $USER@$IP "mkdir -p ~/.ssh && cat >>  ~/.ssh/authorized_keys"
```

PS: Don't forget to make the set the authority of both the `~/.ssh/` and the `authorized_keys` on the remote Server,

```bash
$sudo chmod 700 ~/.ssh
$sudo chmod 640 ~/.ssh/authorized_keys
```

Next time, I still need to enter the password.

When I tried to login with a verbose by enter `-v`, I found the ssh still read the older keygen, id\_rsa.pub.

Finally, I found we need to add this new keygen to make it work. Touch a 'config' file in the `~/.ssh`, and enter:

```bash
Host *
  AddKeysToAgent yes
  IdentityFile ~/.ssh/id_rsa
  IdentityFile ~/.ssh/id_rsa2
```

That will help to solve this problem.

You can also enter the following in the command-line,

```bash
$ssh-add ~/.ssh/id_rsa2
```

It has the same effect.


