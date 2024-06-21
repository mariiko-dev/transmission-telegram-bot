FROM ubuntu:latest
LABEL authors="vma"

ENTRYPOINT ["top", "-b"]