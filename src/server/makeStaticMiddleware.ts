import express from 'express'

export default function makeStaticMiddleware() {
  return express.static(__dirname + '/../../public')
}
