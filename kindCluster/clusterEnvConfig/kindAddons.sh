#!/usr/bin/zsh
# apply ingress to kind cluster
kind create cluster --config kind-cluster-config.yaml
kubectl create secret generic jwt-secret --from-literal JWT_KEY=asdf
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/master/deploy/static/provider/kind/deploy.yaml
