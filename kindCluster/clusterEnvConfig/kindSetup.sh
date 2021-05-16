#!/usr/bin/zsh
kind delete cluster

echo "kind: Cluster
apiVersion: kind.x-k8s.io/v1alpha4
nodes:
- role: control-plane
  kubeadmConfigPatches:
  - |
    kind: InitConfiguration
    nodeRegistration:
      kubeletExtraArgs:
        node-labels: "ingress-ready=true"
  extraPortMappings:
  - containerPort: 80
    hostPort: 80
    protocol: TCP
  - containerPort: 443
    hostPort: 443
    protocol: TCP
- role: worker
- role: worker
- role: worker
  kubeadmConfigPatches:
  - |
    kind: JoinConfiguration
    nodeRegistration:
      kubeletExtraArgs:
        node-labels: "file-server=true"
  extraMounts:
    - hostPath: "/home/tsai/Desktop/algoTrade/containerized"
      containerPath: "/var/local-path-provisioner/stock-data"" | kind create cluster --config -

#secret for ticketing-app
kubectl create secret generic jwt-secret --from-literal JWT_KEY=asdf

# apply ingress to kind cluster
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/master/deploy/static/provider/kind/deploy.yaml
