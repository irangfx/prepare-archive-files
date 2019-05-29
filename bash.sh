#!/bin/sh

oldPassword='tarhan.ir';
newPassword='irangfx.com';

# Extract the archive $1 to a directory $2 with the program $3. If the
# archive contains a single top-level directory, that directory
# becomes $2. Otherwise $2 contains all the files at the root of the
# archive.
extract () (
  set -e
  archive=$1
  case "$archive" in
    -) :;; # read from stdin
    /*) :;; # already an absolute path
    *) archive=$PWD/$archive;; # make absolute path
  esac
  target=$2
  program=$3
  if [ -e "$target" ]; then
    echo >&2 "Target $target already exists, aborting."
    return 3
  fi
  case "$target" in
    /*) parent=${target%/*};;
    */[!/]*) parent=$PWD/${target%/*};;
    *) parent=$PWD;;
  esac
  temp=$(TMPDIR="$parent" mktemp -d)
  (cd "$temp" && $program "$archive")
  root=
  for member in "$temp/"* "$temp/".*; do
    case "$member" in */.|*/..) continue;; esac
    if [ -n "$root" ] || ! [ -d "$member" ]; then
      root=$temp # There are multiple files or there is a non-directory
      break
    fi
    root="$member"
  done
  if [ -z "$root" ]; then
    # Empty archive
    root=$temp
  fi
  mv -v -- "$root" "$target"
  if [ "$root" != "$temp" ]; then
    rmdir "$temp"
  fi
)

# Extract the archive $1.
process () {
  dir=${1%.*}
  case "$1" in
    *.rar|*.RAR) program="unrar x -p$oldPassword";;
    *.zip|*.ZIP) program="unzip";;
    *) echo >&2 "$0: $1: unsupported archive type"; exit 4;;
  esac
  if [ -d "$dir" ]; then
    echo >&2 "$0: $dir: directory already exists"
    exit 1
  fi
  echo $program;
  # extract "$1" "$dir" "$program"
}

process "$1";

# echo "$1 - $2 - $3";