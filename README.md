# drone-sonarqube-setting [![Build Status](https://travis-ci.org/zongwei007/drone-sonarqube-setting.svg?branch=master)](https://travis-ci.org/zongwei007/drone-sonarqube-setting)

用于生产 sonarqube 扫描配置文件 `sonar-project.properties`。支持 `npm` 和 `maven` 项目。

生成的 `sonar-project.properties` 基本格式为：

* sonar.projectKey 对应 git 仓库名 + git 分支名
* sonar.projectName git 分支名
* sonar.sources 插件 `sources` 参数
* sonar.host.url 插件 `host_url` 参数
* sonar.login 插件 `login` 参数，或 `SONAR_TOKEN` 环境变量
* sonar.exclusions 插件 `exclusions` 参数，数组类型
