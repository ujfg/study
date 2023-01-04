import os, sys
ret = os.fork()
if ret == 0:
  print("子プロセス：pid={}, 親プロセス：pid={}".format(os.getpid(), os.getppid()))
  exit()
elif ret > 0:
  print("親プロセス：pid={}, 子プロセス：pid={}".format(os.getpid(), ret))
  exit()
sys.exit(1)
