[![Build Status](https://github.com/zongwei007/drone-sonarqube-scanner/workflows/Build/badge.svg)](https://github.com/zongwei007/drone-sonarqube-scanner/actions?query=workflow%3ABuild)

# drone-sonarqube-scanner

用于生成 sonarqube 配置文件 `sonar-project.properties` 并执行 `sonar-scanner`。支持 `npm` 和 `maven` 项目信息的自动解析。

生成的 `sonar-project.properties` 基本格式为：

- sonar.projectKey 对应 git 仓库名:git 分支名
- sonar.projectName git 仓库名:git 分支名
- sonar.projectVersion 项目版本
- sonar.projectDescription 项目描述
- sonar.branch.name git 分支名，配置 `with_branch` 为 `true` 时生成。
- sonar.modules 子模块信息，多模块项目自动识别并输出。

其余属性会从插件参数中获取，规则为：

- 不需声明 sonar 前缀
- 按 `.` 以对象形式表达数据结构，如 `sonar.host.url` 表达为 `host: { url: "url" }`
- 可以使用数组表示多值，最终会通过 `,` 拼接

配置样例：

```yml
- name: setting-sonarqube
  image: knives/drone-sonarqube-scanner
  settings:
    host:
      url: https://sonar.com
    login:
      from_secret: sonar_login
    exclusions:
      - assets/**
```
