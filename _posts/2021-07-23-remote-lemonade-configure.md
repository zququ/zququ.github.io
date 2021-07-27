---
layout: post
title: lemonade configuration in remote 
date: 2021-07-23 16:17:45:24.000000000 +09:00
tags: vim
---

### About the lemonade

You can find lemonade here.

[github\_lemonade](https://github.com/lemonade-command/lemonade) 

Because, neovim depends on xclip to copy and pasta from the remote Server (e.g. The computers in remote which has a greater computation power), for which, the $DISPLAY is needed. So we can only do copy from the local Client (local computer), we cannot do copy from the remote Server, however.

Here is a way to have the lemonade to make it.

1. First, we need to install lemonade in both Client and the Server, be attention to the environment set.

2. Second, we need to write a script in Server, named with remote:

```bash
#!/bin/bash
ps cax | grep lemonade> /dev/null
if [ $? -eq 0 ]; then
  echo "lemonade is running."
else
  echo "lemonade is not running."
  nohup lemonade server &
fi
ssh -R 2489:127.0.0.1:2489 -p $port $user@$ipadress
```

where, `$port` is the port, and `$user` is the user, `$ipadress` is the I adress of the remote Server IP adress :)

3. Then copy these in neovim's init.vim to config the copy or paste key to set the copy command.

```vimrc
let g:clipboard = {
            \'copy': { '+': 'lemonade copy', '*': 'lemonade copy' },
            \'paste': { '+': 'lemonade paste', '*': 'lemonade paste' },
            \'name': 'lemonade',
            \}
```

After `chmod u+x remote` ( which you created in the second step), you can then register to the Remote after running remote and inputing the password in the command-line.














