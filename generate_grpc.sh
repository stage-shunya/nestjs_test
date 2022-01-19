PROTO_FILE=$1

protoc \
--plugin=./node_modules/.bin/protoc-gen-ts_proto \
--ts_proto_out=src/common/interfaces \
--ts_proto_opt=addGrpcMetadata=true \
--ts_proto_opt=outputClientImpl=true \
--ts_proto_opt=nestJs=true \
--ts_proto_opt=useDate=true \
-I src/protos \
src/protos/"${PROTO_FILE}".proto
