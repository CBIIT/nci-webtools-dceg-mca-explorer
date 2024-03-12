args <- commandArgs(trailingOnly=TRUE)
input <- matrix(as.numeric(args),nrow=2,byrow=TRUE)
test <- fisher.test(input)
cat(test$p.value)