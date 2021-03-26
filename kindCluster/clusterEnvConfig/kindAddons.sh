#!/usr/bin/zsh
# apply ingress to kind cluster
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/master/deploy/static/provider/kind/deploy.yaml
